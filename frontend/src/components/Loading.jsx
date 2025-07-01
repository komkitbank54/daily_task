export default function Loading() {
        return (
            <p className="text-center animate-pulse">
            Loading
            <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
            </p>
        );
    }
