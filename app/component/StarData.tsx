export default function StarData({star, onClose}) {
    const data = star.description.split(',').map((item, index) => {
        return <p key={index} className="text-gray-600">{item}</p>
    })
    return(
        <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{star.name}</h2>
        {data}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    )
}