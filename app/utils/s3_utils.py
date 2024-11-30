def s3FilePathExtract(filepath: str) -> str:

  parts = filepath.split('/')

  return '/'.join(parts[-2:])