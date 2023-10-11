import { HttpHeaders } from "@angular/common/http";
import { LocalStorageKeys } from "../types/constants/localStorageKeys";

export const HeaderNames = {
    ForwardPath: 'T2C-Forward-Path',
}

export class HttpHeaderHelper {
    public static For(path: string, host: string): HttpHeaders {
        let localStorageUser = localStorage.getItem(LocalStorageKeys.The2CharliesUserData) ?? "";
        let parsedUser = JSON.parse(localStorageUser);
        return new HttpHeaders({
            'T2C-Forward-Host': host,
            'T2C-Forward-Path': path,
            'X-T2C-UserReference': parsedUser.id
          })
    }
}
