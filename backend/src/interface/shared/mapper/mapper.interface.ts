export interface IMapper<From, To> {
  map(input: From): To;
}
