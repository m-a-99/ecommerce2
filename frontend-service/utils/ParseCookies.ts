export function ParseCookies(Cookie:string){
      const cookiesArr = (Cookie && Cookie.split(";")) || [];
      const cookies: { [key: string]: string } = {};
      cookiesArr.forEach((cookie) => {
        const tmp = cookie.split("=");
        cookies[tmp[0].trim()] = tmp[1].trim();
      });
      return cookies
}