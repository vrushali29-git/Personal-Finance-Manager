import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="Dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </div>

    )

}
export default App;

