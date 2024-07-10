

const loadingClass = "monnom-loader__loading";
const inPlaceClass = "monnom-loader__inPlace";

let timeout: ReturnType<typeof setTimeout> | undefined;

export const setLoading = (
    state: boolean
) => {

    const loader = document.getElementById("monnomLoader");

    if (loader === null) {
        throw new Error("loader not found!");
    }

    if (state) {
        loader.classList.add(inPlaceClass);
        loader.classList.add(loadingClass);
    } else {
        loader.classList.remove(loadingClass);
        loader.classList.remove(inPlaceClass);

        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            loader.classList.remove(inPlaceClass);
        }, 300);
    }
}