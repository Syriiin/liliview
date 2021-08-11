import { Flip, ToastContainer } from "react-toastify";
import Liliview from "./Liliview";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <>
    <Liliview />
    <ToastContainer
      autoClose={1000}
      hideProgressBar
      transition={Flip}
    />
  </>
)

export default App;
