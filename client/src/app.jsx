import { useState, useEffect } from "react";
import { Satellite, Bot, Globe, ShieldAlert, Sparkles, Send, Activity, RefreshCw } from "lucide-react";

export default function App() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("Ask StarScope AI anything about active missions, orbital mechanics, or asteroids.");
  const [loadingAi, setLoadingAi] = useState(false);

  async function handleAiQuery(e) {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setLoadingAi(true);
    setAiResponse("Querying deep space telemetry nodes...");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
      } else {
        setAiResponse("Telemetry node error responding to request.");
      }
    } catch (err) {
      setAiResponse("Unable to reach backend intelligence server. Ensure Node.js server is running.");
    } finally {
      setLoadingAi(false);
      setAiPrompt("");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/80 bg-[#0b0e17]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan">
            <Satellite className="text-black w-6 h-6 font-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">StarScope</h1>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Intelligence v2.6</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl text-cyan-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live Telemetry Connected</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-10 flex-grow">
        
        {/* AI Space Copilot Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-4 h-4" />
            <span>AI Space Intelligence Copilot</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Query Mission Status & Orbital Hazards</h2>
          
          <div className="bg-black/60 p-4 rounded-2xl border border-gray-800 mb-6 min-h-[80px] flex items-center">
            <p className="text-sm font-mono text-gray-300">{aiResponse}</p>
          </div>

          <form onSubmit={handleAiQuery} className="flex gap-3">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., What is the current telemetry status of Perseverance on Mars?" 
              className="flex-grow bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
            />
            <button 
              disabled={loadingAi}
              type="submit" 
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Active Tracked Assets</div>
            <div className="text-3xl font-black text-white">6 Missions</div>
            <span className="text-[11px] text-emerald-400 font-mono">100% Nominal Telemetry</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Near-Earth Asteroids</div>
            <div className="text-3xl font-black text-pink-400">14 Tracked</div>
            <span className="text-[11px] text-pink-400 font-mono">2 High Risk Close Approaches</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="text-gray-400 text-xs font-mono uppercase mb-2">Exoplanet Database</div>
            <div className="text-3xl font-black text-purple-400">5,500+ Worlds</div>
            <span className="text-[11px] text-purple-400 font-mono">Habitable Zone Verified</span>
          </div>
        </div>

      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500 font-mono">
        © 2026 StarScope Platform. All rights reserved. Built with React & Node.js.
      </footer>
    </div>
  );
}



import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// A simple rotating Sun component
function Sun() {
  const sunRef = useRef();

  // Rotate the sun slightly on every frame
  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#f59e0b" />
    </mesh>
  );
}

export default function SolarSystemCanvas() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      {/* Deep space ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Background starfield */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* Render the Sun */}
      <Sun />

      {/* Allows you to rotate and zoom around the solar system using your mouse */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}


import { useState, useEffect, useRef } from "react";
import { Satellite, Bot, Globe, ShieldAlert, Sparkles, Send, Activity, RefreshCw } from "lucide-react";
import * as THREE from "three";

export default function App() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("Ask SpaceVault AI anything about active missions, orbital mechanics, or asteroids.");
  const [loadingAi, setLoadingAi] = useState(false);
  
  const mountRef = useRef(null);

  // Three.js 3D Solar System Initialization
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 30, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Ambient & Point Lighting (Sunlight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 2.5, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planet Data Configuration (Distance, Radius, Speed, Color)
    const planetData = [
      { name: "Mercury", distance: 8, radius: 0.6, speed: 0.04, color: 0x888888 },
      { name: "Venus", distance: 12, radius: 0.9, speed: 0.015, color: 0xe3bb76 },
      { name: "Earth", distance: 17, radius: 1.0, speed: 0.01, color: 0x2277ff },
      { name: "Mars", distance: 23, radius: 0.8, speed: 0.008, color: 0xc1440e },
      { name: "Jupiter", distance: 31, radius: 2.2, speed: 0.004, color: 0xd4a373 },
    ];

    const planets = planetData.map((data) => {
      // Create orbit ring visual guide
      const orbitGeo = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
      const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      scene.add(orbitLine);

      // Create Planet Mesh
      const meshGeo = new THREE.SphereGeometry(data.radius, 24, 24);
      const meshMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
      const mesh = new THREE.Mesh(meshGeo, meshMat);
      scene.add(mesh);

      return { mesh, distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 };
    });

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Sun slightly
      sun.rotation.y += 0.002;

      // Orbit Planets
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.innerHTML = "";
      }
    };
  }, []);

  async function handleAiQuery(e) {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setLoadingAi(true);
    setAiResponse("Querying deep space telemetry nodes...");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
      } else {
        setAiResponse("Telemetry node error responding to request.");
      }
    } catch (err) {
      setAiResponse("Unable to reach backend intelligence server. Ensure Node.js server is running.");
    } finally {
      setLoadingAi(false);
      setAiPrompt("");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/80 bg-[#0b0e17]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center glow-cyan">
            <Satellite className="text-black w-6 h-6 font-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">SpaceVault</h1>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">3D Intelligence v2.6</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl text-cyan-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live Telemetry Connected</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex-grow">
        
        {/* Interactive 3D Solar System Viewport */}
        <div className="glass-panel rounded-3xl p-4 border border-cyan-500/30 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 pt-2 mb-2">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
              <Globe className="w-4 h-4" />
              <span>Real-Time 3D Orbital Simulation (Inner System)</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-2.5 py-1 rounded-lg border border-gray-800">
              Three.js WebGL Engine
            </span>
          </div>
          
          {/* 3D Canvas Mount Point */}
          <div ref={mountRef} className="w-full h-[360px] sm:h-[420px] rounded-2xl cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#03050a] to-[#070b14]" />
        </div>

        {/* AI Space Copilot Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono mb-3">
            <Sparkles className="w-4 h-4" />
            <span>AI Space Intelligence Copilot</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Query Mission Status & Orbital Hazards</h2>
          
          <div className="bg-black/60 p-4 rounded-2xl border border-gray-800 mb-6 min-h-[80px] flex items-center">
            <p className="text-sm font-mono text-gray-300">{aiResponse}</p>
          </div>

          <form onSubmit={handleAiQuery} className="flex gap-3">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., What is the current telemetry status of Perseverance on Mars?" 
              className="flex-grow bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400"
            />
            <button 
              disabled={loadingAi}
              type="submit" 
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>
        </div>

      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500 font-mono">
        © 2026 SpaceVault Platform. All rights reserved. Built with React, Three.js & Node.js.
      </footer>
    </div>
  );
}