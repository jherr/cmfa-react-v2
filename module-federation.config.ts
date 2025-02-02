export const mfConfig = {
  name: "hello",
  exposes: {
    "./Foo": "./src/Foo.tsx",
  },
  shared: ["react", "react-dom", "react-router-dom"],
};
