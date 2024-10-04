from fastapi import FastAPI
from fastapi.responses import JSONResponse
from io import StringIO
import requests
import pandas as pd
import json
from pydantic import BaseModel
from astroquery.gaia import Gaia
import astropy.units as u
from astropy.coordinates import SkyCoord
from typing import List, Optional
from form import router as form_router 
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# form api
app.include_router(form_router)


# Define the response model
class StarData(BaseModel):
    ra: float
    dec: float
    parallax: Optional[float] 
    pmra: Optional[float]      
    pmdec: Optional[float]     
    phot_g_mean_mag: Optional[float] 
    bp_rp: Optional[float]  

class StarResponse(BaseModel):
    number_of_stars: int
    stars: List[StarData]

@app.get("/cone_search/", response_model=StarResponse)
def cone_search(ra: float, dec: float, radius: float):
    """
    Perform a cone search around the specified coordinates.
    
    Parameters:
    - ra: Right Ascension in degrees
    - dec: Declination in degrees
    - radius: Search radius in degrees

    Returns:
    A list of stars found in the specified region.
    """
    # Create the SkyCoord object
    coord = SkyCoord(ra=ra, dec=dec, unit=(u.degree, u.degree), frame='icrs')

    # Set the search radius
    search_radius = u.Quantity(radius, u.deg)

    # Set the row limit for Gaia query
    Gaia.ROW_LIMIT = 1000

    # Perform the cone search
    job = Gaia.cone_search_async(coord, radius=search_radius)
    r = job.get_results()

    # Select only the required columns
    columns_to_keep = ['ra', 'dec', 'parallax', 'pmra', 'pmdec', 'phot_g_mean_mag', 'bp_rp']
    filtered_results = r[columns_to_keep]


    # Prepare the response
    stars = []
    for row in filtered_results:
        #validate the data
        if row['parallax'] is None or not (float('-inf') < row['parallax'] < float('inf')):
            row['parallax'] = 0
        if row['pmra'] is None or not (float('-inf') < row['pmra'] < float('inf')):
            row['pmra'] = 0
        if row['pmdec'] is None or not (float('-inf') < row['pmdec'] < float('inf')):
            row['pmdec'] = 0
        if row['phot_g_mean_mag'] is None or not (float('-inf') < row['phot_g_mean_mag'] < float('inf')):
            row['phot_g_mean_mag'] = 0
        if row['bp_rp'] is None or not (float('-inf') < row['bp_rp'] < float('inf')):
            row['bp_rp'] = 0
            
        stars.append(StarData(
            ra=row['ra'],
            dec=row['dec'],
            parallax=row['parallax'],
            pmra=row['pmra'],
            pmdec=row['pmdec'],
            phot_g_mean_mag=row['phot_g_mean_mag'],
            bp_rp=row['bp_rp']
        ))

    return StarResponse(number_of_stars=len(stars), stars=stars)

pi = 3.14159
au = 1.496e11  # m
rsun = 6.955e8  # m
G = 0.00029591220828559104  # day, AU, Msun

# Keplerian semi-major axis (au)
sa = lambda m, P: (G * m * P ** 2 / (4 * pi ** 2)) ** (1. / 3)

def tap_query(base_url, query, dataframe=True):
    # Table Access Protocol query

    # Build URL
    uri_full = base_url
    for k in query:
        if k != "format":
            uri_full += f"{k} {query[k]} "
    
    uri_full = uri_full[:-1] + f"&format={query.get('format', 'csv')}"
    uri_full = uri_full.replace(' ', '+')
    
    response = requests.get(uri_full, timeout=90)

    if dataframe:
        return pd.read_csv(StringIO(response.text))
    else:
        return response.text

def new_scrape2(limit=-1,pl_name=""):
    uri_ipac_base = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query="
    where_clause = "tran_flag = 1 AND default_flag = 1"
    if pl_name != "":
        where_clause += f" AND LOWER(pl_name) LIKE LOWER('%{pl_name}%')"  # Case insensitive match

    select_clause = "pl_name,hostname,tran_flag,pl_massj,pl_orbper,ra,dec"
    if limit > 0:
        select_clause = f"TOP {limit} pl_name,hostname,tran_flag,pl_massj,pl_orbper,ra,dec"
    

    uri_ipac_query = {
        "select": select_clause,
        "from": "ps",
        "where": where_clause,
        "format": "csv"
    }

    default = tap_query(uri_ipac_base, uri_ipac_query)
    default = default.head(limit) 
    return default.dropna(axis=1)


@app.get("/exoplanets")
async def get_exoplanets(limit: int = -1,pl_name=""):
    dataframe = new_scrape2(limit,pl_name)
    json_data = json.loads(dataframe.to_json(orient='table', index=False))
    return JSONResponse(content=json_data.get('data'))

