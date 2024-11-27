def s3FilePathExtract(filepath: str) -> str:

  print(filepath)

  parts = filepath.split('/')
  ans = '/'.join(parts[-2:])
  print(ans)

  return ans