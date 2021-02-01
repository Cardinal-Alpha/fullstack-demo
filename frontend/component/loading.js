
export function LoadingOverlay() {
    const overlayStyle={
        zIndex:999,
        position:'fixed',
        top:0,
        bottom:0,
        left:0,
        right:0
    }
    return (
        <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={overlayStyle}>
            <span className="pi pi-spin pi-spinner" style={{fontSize: '10vw', display:'-block'}}></span>
            <h1>Loading</h1>
        </div>
    )
}
