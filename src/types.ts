export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export enum SharingStatus {
  ENDED,
  ACTIVE,
  FULL,
}

export interface LocalSharing {
  lat: string;
  lng: string;
  pack_number: number;
  per_pack_number: number;
  if_free: 1 | 0;
  price: string;
  remarks: string;
}

export interface Sharing extends LocalSharing {
  id: number;
  created_time: string;
  created_by: number;
  status: SharingStatus;
  total_apply?: string;
}

export interface SharingContact {
  created_at: string;
  mobile: string;
  user_name: string;
}

// --- React Navigation --- //
export type MainStackParamList = {
  SharingDetail: {
    id: number;
    from?: string;
  };
  SharingContact: {
    id: number;
  };
};

export type MapStackParamList = {
  Map: { location: GeoCoordinates };
  SharingList: { sharingList: Sharing[] };
};

export type SettingsStackParamList = {
  MySharings: { finishedId: number };
};

export type CreateSharingStackParamList = {
  CreateSharing: { selectedCode: string };
  CurrencyPicker: { selectedCode: string };
};

// --- API --- //
export interface ResponseError {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
}

export interface LoginRequest {
  fb_token: string;
}

export interface LoginResponse {
  data: {
    datetime: number;
    jwtoken: string;
    uid: number;
  };
}

export interface GetCurrentUserResponse {
  data: {
    uid: number;
    name: string;
    email: string;
    mobile: string;
  };
}

export interface UpdateCurrentUserResponse {
  data: {
    uid: number;
    email: string;
    mobile: string;
    updated_at: number;
  };
}

export interface GetSharingDetailResponse {
  data: Sharing;
}

export interface GetNearbySharingsResponse {
  data: Sharing[];
}

export interface GetMySharingsResponse {
  data: Sharing[];
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface CreateSharingResponse {
  data: Sharing;
}

export interface GetSharingContactResponse {
  data: SharingContact[];
}

export interface ApplySharingResponse {
  message: string;
  data: any;
}
