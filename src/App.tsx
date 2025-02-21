import Landing from "./pages/Landing";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import UserAuthLayout from "./routing/UserAuthLayout";
import "./sass/main.scss";
import TablePage from "./pages/TablePage";

function App() {
    return (
        <Router>
            <div>
                <section>
                    <Routes>
                        <Route path="/" element={<Signin />} />
                        <Route path="/" element={<UserAuthLayout />}>
                            <Route path="/landing" element={<Landing />} />
                            <Route path="/table" element={<TablePage />} />
                        </Route>
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;
