'use client';
import React, { useState } from 'react';
import { mockLivestreams } from '../data/livestreams';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
  const [streams, setStreams] = useState([...mockLivestreams]);

  const handleSave = (idx: number, updated: any) => {
    const newStreams = [...streams];
    newStreams[idx] = updated;
    setStreams(newStreams);
  };

  return (
    <div className="min-h-screen bg-mauve p-8">
      <h1 className="text-3xl font-bold mb-6">Projects (Livestreams)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream, idx) => (
          <ProjectCard key={stream.id} livestream={stream} onSave={updated => handleSave(idx, updated)} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage; 