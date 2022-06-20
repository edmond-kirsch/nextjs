import loaderStyles from '../styles/Loader.module.css';
import ReactLoading from "react-loading";

export default function Loading() {
    return (
        <div className={loaderStyles.loaderWrapper}>
            <ReactLoading
                type={"bars"}
                color={"#0f46a0"}
                height={100}
                width={100}
            />
        </div>
    )
}
