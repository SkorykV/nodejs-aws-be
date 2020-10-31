module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  return {
    plugins: isTest ? [] : ["source-map-support"],
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "12"
                }
            }
        ]
    ]
};
};