/*
* STORAGE
*/

type storage = {
  balance:                nat,
  token_metadata_address: address
};

/*
* BALANCE_OF ENTRYPOINT
*/

type balance_of_request = {
  owner:    address,
  token_id: nat
};

type balance_of_request_michelson = michelson_pair_right_comb(balance_of_request);

type balance_of_response = {
  request: balance_of_request_michelson,
  balance: nat
}

type balance_of_response_michelson = michelson_pair_right_comb(balance_of_response);

type balance_of_param = {
  requests: list (balance_of_request_michelson),
  callback: contract (list (balance_of_response_michelson))
}

type balance_of_param_michelson = michelson_pair_right_comb(balance_of_param);

/*
* ENTRYPOINTS
*/

type entrypoint =
  | GetBalanceOf ((address, list (address)))
  | ReceiveBalanceOf (list (balance_of_response_michelson))
  | GetTokenMetadata (address)
  | ReceiveTokenMetadataAddress (address);

let getBalanceOf = (contractAddr: address, userAddresses: list (address), s: storage): (list (operation), storage) => {
  // tzip12 contract from which the balance should be requested
  let tzip12: contract (balance_of_param_michelson) = 
    switch(Tezos.get_entrypoint_opt("%balance_of", contractAddr): option(contract(balance_of_param_michelson))){
    | None => failwith ("ContractNotFound"): contract (balance_of_param_michelson)
    | Some (contr) => contr
  };
  // current contract where the balance should be received
  let callback: contract (list (balance_of_response_michelson)) = 
    switch(Tezos.get_entrypoint_opt("%receiveBalanceOf", Tezos.self_address): option(contract(list (balance_of_response_michelson)))){
    | None => failwith ("Error"): contract (list (balance_of_response_michelson))
    | Some (cb) => cb
  };
  let param: balance_of_param_michelson = 
    Layout.convert_to_right_comb({ 
      requests: List.map((userAddress: address): balance_of_request_michelson => {
        Layout.convert_to_right_comb({ owner: userAddress, token_id: 0n }: balance_of_request);
      }, userAddresses), 
      callback: callback
    }: balance_of_param) ;
  // sends transaction
  ([Tezos.transaction(param, 0tez, tzip12)], s);
}

let receiveBalanceOf = (responses: list (balance_of_response_michelson), s: storage): storage => {
  let sum = ((i, response): (nat, balance_of_response_michelson)): nat => {
    let rsp: balance_of_response = Layout.convert_from_right_comb(response);
    rsp.balance + i ;
  };

  {...s, balance: List.fold (sum, responses, 0n)};
};

let getTokenMetadata = (contractAddr: address, s: storage): (list (operation), storage) => {
  // tzip12 contract from which the token metadata should be requested
  let tzip12: contract (contract (address)) = 
    switch(Tezos.get_entrypoint_opt("%token_metadata_registry", contractAddr): option(contract(contract (address)))){
    | None => failwith ("FA2NotFound"): contract (contract (address))
    | Some (contr) => contr
  };
  // casts contract address to contract type
  let param: contract (address) = 
    switch (Tezos.get_entrypoint_opt("%receiveTokenMetadataAddress", Tezos.self_address): option (contract (address))) {
      | None => failwith ("ContractNotFound"): contract (address)
      | Some (contr) => contr
    } ;
  // sends transaction
  ([Tezos.transaction(param, 0tez, tzip12)], s);
} ;

let receiveTokenMetadataAddress = (addr: address, s: storage): storage => {
  {...s, token_metadata_address: addr} ;
}

let main = ((p, s): (entrypoint, storage)) => {
  switch (p) {
    | GetBalanceOf (params) => getBalanceOf(params[0], params[1], s)
    | ReceiveBalanceOf (l) => ([]: list (operation), receiveBalanceOf(l, s))
    | GetTokenMetadata (addr) => getTokenMetadata(addr, s)
    | ReceiveTokenMetadataAddress (addr) => ([]: list (operation), receiveTokenMetadataAddress(addr, s))
    };
};