function  getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
        mouseX: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        mouseY: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

export default getMousePos