import React from 'react';
import Plot from 'react-plotly.js';

const Jaw3DPlot = ({ allTeeth3D, statusColor }) => (
  <Plot
    data={[
      {
        x: allTeeth3D.map(t => t.x),
        y: allTeeth3D.map(t => t.y),
        z: allTeeth3D.map(t => t.z),
        text: allTeeth3D.map(t => t.status !== 'missing' ? `Tooth ${t.id}` : ''),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          size: 14,
          color: allTeeth3D.map(t => statusColor[t.status] || 'blue'),
          symbol: 'circle',
          line: { color: 'black', width: 2 }
        }
      }
    ]}
    layout={{
      width: 800,
      height: 500,
      title: '3D Human Mouth Jaw',
      scene: {
        xaxis: { title: 'X', showgrid: true, visible: true, color: '#1976d2', titlefont: { color: '#1976d2', size: 16 } },
        yaxis: { title: 'Y', showgrid: true, visible: true, color: '#388e3c', titlefont: { color: '#388e3c', size: 16 } },
        zaxis: { title: 'Z', showgrid: true, visible: true, color: '#f44336', titlefont: { color: '#f44336', size: 16 } },
        aspectratio: { x: 2, y: 1, z: 0.5 }
      },
      margin: { l: 0, r: 0, b: 0, t: 40 },
      showlegend: false
    }}
  />
);

export default Jaw3DPlot;
