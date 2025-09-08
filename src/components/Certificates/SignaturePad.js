import React, { useRef } from 'react';

const SignaturePad = ({ onChange }) => {
  const canvasRef = useRef(null);
  let drawing = false;

  const startDrawing = (e) => {
    drawing = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    drawing = false;
    const dataUrl = canvasRef.current.toDataURL();
    if (onChange) onChange(dataUrl);
  };

  const clearPad = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (onChange) onChange('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        style={{ border: '1px solid #ccc', borderRadius: 4, background: '#fff' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <button type="button" onClick={clearPad} style={{ marginTop: 8 }}>Clear</button>
    </div>
  );
};

export default SignaturePad;
