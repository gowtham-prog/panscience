import React from "react"
export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-50">
            <div role="status" className="animate-spin rounded-full h-10 w-10 border-b-4 border-white">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
