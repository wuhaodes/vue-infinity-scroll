import ''

type Basic = string | number | boolean;

declare global {
  interface Dic<T> {
    [index: string]: T
  }

  interface DataSet {
    [index: string]: Basic | Basic[] | DataSet | DataSet[];
  }

  type TUploaderData = {
    OSSAccessKeyId: string,
    policy: string,
    Signature: string,
    key: string,
    success_action_status?: number
  }
}