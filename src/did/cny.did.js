export const idlFactory = ({ IDL }) => {
  const Sell = IDL.Service({
    'getPrincipal' : IDL.Func([], [IDL.Text], ['query']),
  });
  return Sell;
};
export const init = ({ IDL }) => { return []; };
