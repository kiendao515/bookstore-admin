// Lay kich thuoc cua cua so trinh duyet
// Tra ve object chua width va height cua trinh duyet

const { useState, useEffect } = require("react");

// Hook
function useWindowSize() {
    // Khoi tao state width/height undefined
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Ham xu ly duoc goi khi window resize
        function handleResize() {
            // Cap nhat state width/height
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Lang nghe su kien window duoc resize
        window.addEventListener('resize', handleResize);

        // Goi ham xu ly luon de lay ve kich thuoc ban dau
        handleResize();

        // Huy lang nghe khi cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}

export default useWindowSize;