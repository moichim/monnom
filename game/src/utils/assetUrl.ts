/** 
 * Detect dev mode 
 * @see https://vitejs.dev/guide/env-and-mode 
 */
export const isDev = import.meta.env.DEV

const assetsUrlPrefix = isDev ? "" : "/wp-content/themes/monnom/game/";
const apiUrlPrefix = isDev ? "http://localhost:8080" : "";

/** Make sure the asset URL is correct */
export const assetUrl = (
    url: string
) => {
    return assetsUrlPrefix + url;
}

export const apiUrl = (
    url: string
) => {
    return apiUrlPrefix + url;
}