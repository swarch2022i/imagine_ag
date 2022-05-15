// export const url = 'host.docker.internal'
// export const port = '1234'
// export const entryPoint = 'api/storage'
// export const url = 'localhost'
// export const port = '3000'
export const url = process.env.STORAGE_MS_URL
export const port = process.env.STORAGE_MS_PORT
export const entryPoint = 'api/storage'