export interface OrderImage {
  id?: number;
  orderId?: number;
  file?: File;
  fileName: string;
  contentType?: string;
  data: string;
}
