declare module 'node-pandoc' {
  function pandoc(
    input: string,
    from: string,
    to: string,
    args?: string[]
  ): Promise<Buffer>;
  
  export = pandoc;
}
