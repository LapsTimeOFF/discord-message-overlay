const useQueryParams = () => {
  const url = window.location.href;

  const paramsString = url.split("?")[1];
  const params = paramsString.split("&");

  const paramsObject: { [key: string]: string }[] = params.map((param) => {
    return { key: param.split("=")[0], value: param.split("=")[1] };
  });

  return paramsObject;
};

export default useQueryParams;
