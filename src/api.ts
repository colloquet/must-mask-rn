import AsyncStorage from '@react-native-community/async-storage';
import { GOOGLE_PLACE_API_KEY } from 'react-native-dotenv'
import {
  LoginResponse,
  GetCurrentUserResponse,
  UpdateCurrentUserResponse,
  GetSharingDetailResponse,
  GetNearbySharingsResponse,
  GetMySharingsResponse,
  CreateSharingResponse,
  GetSharingContactResponse,
  ApplySharingResponse,
  GeoCoordinates,
  LocalSharing,
} from './types';

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const withRetry = <T>(
  fn: (...args: any[]) => Promise<T>,
  delay: number = 1000,
) => async (...args: any[]) => {
  try {
    return await fn(...args);
  } catch (err) {
    if (err.status === 429) {
      try {
        // retry after 1 second
        await wait(delay);
        return await fn(...args);
      } catch (_err) {
        throw _err;
      }
    }

    throw err;
  }
};

export const facebookLogin = withRetry(async function (accessToken: string) {
  try {
    const response = await fetch(
      `https://mustmask.com/api/users/login?fb_token=${accessToken}`,
      {
        method: 'POST',
      },
    );
    const json: LoginResponse = await response.json();
    if (!response.ok) throw json;

    const { jwtoken: jwt, uid } = json.data;
    return {
      jwt,
      uid,
    };
  } catch (err) {
    throw err;
  }
});

export const appleLogin = withRetry(async function (
  identityToken: string,
  name: string,
) {
  try {
    let url = `https://mustmask.com/api/users/applelogin?identityToken=${identityToken}`;
    if (name.trim()) {
      url = url + `&name=${name}`;
    }
    const response = await fetch(url, {
      method: 'POST',
    });
    const json: LoginResponse = await response.json();
    if (!response.ok) throw json;

    const { jwtoken: jwt, uid } = json.data;
    return {
      jwt,
      uid,
    };
  } catch (err) {
    throw err;
  }
});

// --- User --- //
export const getCurrentUser = withRetry(async function () {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch('https://mustmask.com/api/users/detail', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const json: GetCurrentUserResponse = await response.json();
    if (!response.ok) throw json;

    const { data } = json;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export const updateCurrentUser = withRetry(async function ({
  email,
  mobile,
}: {
  email: string;
  mobile: string;
}) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/users/update?email=${email}&mobile=${mobile}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json: UpdateCurrentUserResponse = await response.json();
    if (!response.ok) throw json;
  } catch (err) {
    throw err;
  }
});

// --- Sharing --- //
export const getSharingDetail = withRetry(async function (sharingId: number) {
  try {
    const response = await fetch(
      `https://mustmask.com/api/sharings/detail?id=${sharingId}`,
    );
    const json: GetSharingDetailResponse = await response.json();
    if (!response.ok) throw json;
    return json;
  } catch (err) {
    throw err;
  }
});

export const getNearbySharings = withRetry(async function (
  location: GeoCoordinates,
) {
  try {
    const response = await fetch(
      `https://mustmask.com/api/sharings/near?mypoint=${location.latitude},${location.longitude}`,
    );
    const json: GetNearbySharingsResponse = await response.json();
    if (!response.ok) throw json;
    return json;
  } catch (err) {
    throw err;
  }
});

export const getMySharings = withRetry(async function (page: number) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/sharings/my?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json: GetMySharingsResponse = await response.json();
    if (!response.ok) throw json;
    return json;
  } catch (err) {
    throw err;
  }
});

export const endMySharing = withRetry(async function (id: number) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/sharings/end?id=${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json = await response.json();
    if (!response.ok) throw json;
  } catch (err) {
    throw err;
  }
});

export const applySharing = withRetry(async function (id: number) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/sharings/apply?sharing_id=${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json: ApplySharingResponse = await response.json();
    if (!response.ok) throw json;

    return json;
  } catch (err) {
    throw err;
  }
});

export const createSharing = withRetry(async function ({
  lat,
  lng,
  pack_number,
  per_pack_number,
  if_free,
  price,
  remarks,
}: LocalSharing) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/sharings/create?coordinates=${lat},${lng}&pack_number=${pack_number}&per_pack_number=${per_pack_number}&if_free=${Number(
        if_free,
      )}&price=${price}&optional_name=${remarks}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json: CreateSharingResponse = await response.json();
    if (!response.ok) throw json;

    return json;
  } catch (err) {
    throw err;
  }
});

export const getSharingContact = withRetry(async function (sharingId: number) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/sharings/list?id=${sharingId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json: GetSharingContactResponse = await response.json();
    if (!response.ok) throw json;

    return json;
  } catch (err) {
    throw err;
  }
});

export const getMyApplies = withRetry(async function (page: number) {
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) throw new Error('JWT not found');

    const response = await fetch(
      `https://mustmask.com/api/users/applies?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const json = await response.json();
    if (!response.ok) throw json;

    return json;
  } catch (err) {
    throw err;
  }
});

// --- Others --- //
const geocodeCache: Record<string, any> = {};
export async function geocode(query: string) {
  try {
    if (query in geocodeCache) {
      return geocodeCache[query];
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&region=hk&language=zh-HK&key=${GOOGLE_PLACE_API_KEY}`,
    );
    const json = await response.json();

    const result = {
      results: json.results.map((item: any) => ({
        id: item.place_id,
        region: {
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng,
          latitudeDelta:
            item.geometry.viewport.northeast.lat -
            item.geometry.viewport.southwest.lat,
          longitudeDelta:
            item.geometry.viewport.northeast.lng -
            item.geometry.viewport.southwest.lng,
        },
        name: item.name,
        formattedAddress: item.formatted_address,
      })),
      status: json.status,
    };

    geocodeCache[query] = result;

    return result;
  } catch (err) {
    throw err;
  }
}
