declare module '*.jpg' {
  const value: string | undefined;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}