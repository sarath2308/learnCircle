export interface ICompressor {
  compress(inputPath: string): Promise<string>;
}
