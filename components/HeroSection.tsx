'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls, bookGroup: THREE.Group;
    let clock: THREE.Clock = new THREE.Clock();

    const initThree = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0f);

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 10);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0a0a0f, 0);
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffd700, 0.6);
      directionalLight.position.set(5, 10, 7);
      scene.add(directionalLight);

      // Create book
      createBook();

      // Add controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      window.addEventListener('resize', onWindowResize);

      animate();
    };

    const createBook = () => {
      bookGroup = new THREE.Group();
      
      const width = 4;
      const height = 6;
      const depth = 0.5;
      const pageCount = 40;
      const pageThickness = depth / pageCount;

      // Book cover with gold border
      const coverGeometry = new THREE.BoxGeometry(width, height, depth * 0.1);
      const coverMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x13131a,
        metalness: 0.3,
        roughness: 0.7
      });
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);
      cover.position.z = depth * 0.45;
      bookGroup.add(cover);

      // Animated pages
      for (let i = 0; i < pageCount; i++) {
        const pageGeometry = new THREE.PlaneGeometry(width - 0.1, height - 0.1);
        const pageMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xf8f4e3,
          side: THREE.DoubleSide,
          opacity: 0.8,
          transparent: true
        });
        const page = new THREE.Mesh(pageGeometry, pageMaterial);
        page.position.z = -depth * 0.5 + i * pageThickness + pageThickness / 2;
        page.position.y = 0;
        bookGroup.add(page);
      }

      // Add title text on cover
      const loader = new FontLoader();
      loader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (font) => {
          const textGeometry = new TextGeometry('Uni UI', {
            font: font,
            size: 0.5,
            depth: 0.02,
          });
          const textMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2
          });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textGeometry.computeBoundingBox();
          const textWidth = textGeometry.boundingBox ? textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x : 0;
          textMesh.position.set(-textWidth / 2, 0, depth * 0.5 + 0.01);
          bookGroup.add(textMesh);
        }
      );

      scene.add(bookGroup);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      if (bookGroup) {
        bookGroup.rotation.y = scrollY * 0.001;
        const time = clock.getElapsedTime();
        bookGroup.position.y = Math.sin(time * 0.5) * 0.1;
        // Page flutter animation
        bookGroup.children.forEach((child, index) => {
          if (index > 0 && index < 10) {
            (child as THREE.Mesh).rotation.z = Math.sin(time + index * 0.1) * 0.02;
          }
        });
      }

      renderer.render(scene, camera);
    };

    initThree();

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', handleScroll);
      if (renderer) {
        renderer.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, [scrollY, isScrolling]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-heading text-[#D4AF37] mb-6 animate-fade-in">
              Uni UI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
              A study organization platform built by an engineering student, for engineering students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <a href="/join" className="px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all duration-300 hover:scale-105">
                Join Waitlist
              </a>
              <a href="/about" className="px-8 py-3 border border-[#D4AF37]/30 text-[#D4AF37] font-medium rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-300">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}