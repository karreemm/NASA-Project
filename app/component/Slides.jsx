/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

const sketch = (p) => {
    let points = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        initPoints();
    };

    p.draw = () => {
        p.background('#030712');

        for (let i = 0; i < points.length; i++) {
            points[i].update();
            points[i].display();

            for (let j = i + 1; j < points.length; j++) {
                let distance = p.dist(points[i].x, points[i].y, points[j].x, points[j].y);
                if (distance < 150) {
                    p.stroke(255, 150 - distance);
                    p.strokeWeight(1);
                    p.line(points[i].x, points[i].y, points[j].x, points[j].y);
                }
            }
        }
    };

    p.mouseMoved = () => {
        for (let i = 0; i < points.length; i++) {
            points[i].attract(p.mouseX, p.mouseY);
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initPoints();
    };

    function initPoints() {
        points = [];
        for (let i = 0; i < 100; i++) {
            points.push(new Point(p.random(p.width), p.random(p.height)));
        }
    }

    class Point {
        constructor (x, y) {
            this.x = x;
            this.y = y;
            this.vx = p.random(-1, 1);
            this.vy = p.random(-1, 1);
        }

        attract(mx, my) {
            let force = p.createVector(mx - this.x, my - this.y);
            let distance = p.constrain(force.mag(), 1, 100);
            force.setMag(0.1);
            this.vx += force.x / distance;
            this.vy += force.y / distance;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x > p.width || this.x < 0) this.vx *= -1;
            if (this.y > p.height || this.y < 0) this.vy *= -1;
        }

        display() {
            p.noStroke();
            p.fill(255);
            p.ellipse(this.x, this.y, 5, 5);
        }
    }
};

const P5WrapperComponent = () => {
    return (
        <div className="relative h-full rounded-b-lg overflow-hidden">
    <NextReactP5Wrapper sketch={sketch} />
    <div className="absolute bottom-0 left-0 p-10 text-white w-full "> {/* Rounded bottom corners */}
        <h1 className="text-4xl font-bold mb-3">Exotics for Exoplanets</h1>
        <p className="text-lg max-w-[1000px]">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
    </div>
</div>
    );
};

export default P5WrapperComponent;
