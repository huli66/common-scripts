import {Base64} from 'js-base64';
type SuccessType = (res: any) => any;
type FailType = (
  code?: string | number,
  message?: string
) => any | ((error?: object) => any);

// ----------------------------------------------------------------------------
interface qbWindowProps {
  cefQuery?: (p: object) => void;
  QBbrowser?: any;
}

const qbWindows: qbWindowProps & Window = window;

const cefQuery = qbWindows.cefQuery; // 进入 QB 客户端， C++ 自动为 window 挂载该属性。
const qBbrowser = qbWindows.QBbrowser; // 进入 QB 客户端， C++ 自动为 window 挂载该属性。

export const inQb = () => !!cefQuery;
export const inQbBrowser = () => !!qBbrowser;

// ----------------------------------------------------------------------------

let qb: any = null;

if (inQbBrowser()) {
  qb = new qbWindows.QBbrowser();
}

export const api = (
  funcName: string,
  reqStr: string,
  success?: SuccessType,
  failure?: FailType
) => {
  if (!inQb()) {
    return;
  }
  cefQuery &&
    cefQuery({
      request: reqStr,
      onSuccess:
        success ||
        function(response) {
          console.info(response);
        },
      onFailure:
        failure ||
        function(errorCode, errorMessage) {
          console.info(funcName + ' : ' + errorMessage);
        }
    });
};

// ----------------------------------------------------------------------------

// 获取QB登录用户信息
export const getUser = (success?: SuccessType, failure?: FailType) => {
  var reqStr = '["req_cache",[{"data":"UserInfo"}]]';
  api(
    'getUser',
    reqStr,
    (res) => {
      let user = JSON.parse(res);
      (success as any)({
        ...user,
        id: user.UserId,
        username: user.UserAccount,
        password: user.Password
      });
    },
    failure
  );
};

// 获取 FQ 报价
export const getFqData = (
  success?: SuccessType,
  failure?: FailType,
  dataid?: string
) => {
  const reqObj: any = {
    data: 'QuoteManageImportData'
  };
  if (dataid) {
    reqObj.dataid = dataid;
  }
  const req = ['req_cache', [reqObj]];
  var reqStr = JSON.stringify(req);
  api(
    'getFqData',
    reqStr,
    (res) => {
      const resData = JSON.parse(res);
      console.log('获取 FQ 报价：', resData, req);
      success && (success as any)(resData);
    },
    failure
  );
};

// 打开QB精简报价
export const openQbQuoteWindow = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  const reqStr = `["open_page", [{"name":"bond_short_quote","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbQuoteWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    failure
  );
};

// 打开QB价格试算
export const openQbCalculateWindow = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  var reqStr = `["open_page", [{"name":"bondcalculate","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbCalculateWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    failure
  );
};

// 查询QB版本
export const getQbVersion = (success?: SuccessType, failure?: any) => {
  const reqStr = `["req_cache", [{"data":"Version"}]]`;
  api(
    'getQbVersion',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)({
        version: result.version
      });
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 查询是否可切换至指定债券
export const getChangeBondResult = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["change_bond", [{"bondkey":"${bondInfo.bondkey}.${bondInfo.listedmarket}"}]]`;
  api(
    'getChangeBondResult',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)({
        changed: result.changed
      });
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 打开新的债券详情tab页
export const openNewBondDetail = (
  bondInfo: any,
  success?: SuccessType,
  failure?: FailType
) => {
  const reqStr = `["open_page", [{"name":"bond_detail","bondkey":"${bondInfo.bondkey}","listmarket":"${bondInfo.listedmarket}"}]]`;
  api(
    'openQbQuoteWindow',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      console.log('调用打开新tab接口：', result);
    },
    failure
  );
};

// 查询当前债券是否存在关注组
export const getBondAttention = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Check"}]]`;
  api(
    'getBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 管理当前债券关注组
export const modifyBondAttention = (
  bondInfo: any,
  success?: SuccessType,
  failure?: any
) => {
  const reqStr = `["req_cache", [{"data":"BondAttention","callback":"handleManageAttention","BondKey":"${bondInfo.bondkey}","ListedMarket":"${bondInfo.listedmarket}","Todo":"Modify"}]]`;
  api(
    'modifyBondAttention',
    reqStr,
    (res) => {
      let result = JSON.parse(res);
      (success as any)(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 获取我的关注组
export const reqAttention = (success?: SuccessType, failure?: FailType) => {
  if (qb) {
    qb.getCommon(
      ['tds_req', {type: 'tds.req.system.attention'}, ''],
      (res: any) => {
        console.log(res);
      },
      (error_code: any, error_message: any) => {
        console.log(error_code, error_message);
      }
    );
  } else {
    (window as any).tds_reqAttention = function(result: any) {
      var {group, finish} = result || {};
      typeof success === 'function' && (success as any)(group || [], finish);
    };
    var reqStr = `["tds_req", [{"req": "${Base64.encode(
      JSON.stringify({type: 'tds.req.system.attention'})
    )}", "callback": "${Base64.encode('tds_reqAttention')}"}]]`;
    api(
      'reqAttention',
      reqStr,
      (res) => {
        console.log(res);
      },
      (code, message) => {
        console.log(code, message);
      }
    );
  }
};

// 获取我的债券组
export const reqIssuerAttention = (
  success?: SuccessType,
  failure?: FailType
) => {
  if (qb) {
    qb.getCommon(
      ['tds_req', {type: 'tds.req.system.issuerattention'}, ''],
      (res: any) => {
        console.log(res);
      },
      (error_code: any, error_message: any) => {
        console.log(error_code, error_message);
      }
    );
  } else {
    (window as any).tds_reqIssuerAttention = function(result: any) {
      var {group, finish} = result || {};
      typeof success === 'function' && (success as any)(group || [], finish);
    };
    var reqStr = `["tds_req", [{"req": "${Base64.encode(
      JSON.stringify({type: 'tds.req.system.issuerattention'})
    )}", "callback": "${Base64.encode('tds_reqIssuerAttention')}"}]]`;
    api(
      'reqIssuerAttention',
      reqStr,
      (res) => {
        console.log(res);
      },
      (code, message) => {
        console.log(code, message);
      }
    );
  }
};

export const getSystemTime = (success?: SuccessType, failure?: FailType) => {
  (window as any).tds_getSystemTime = function(result: any) {
    var {time} = result || {};
    typeof success === 'function' && (success as any)(time);
  };
  var reqStr = `["tds_req", [{"req": "eyJ0eXBlIjoidGRzLnJlcS5zeXN0ZW0udGltZSJ9", "callback": "${Base64.encode(
    'tds_getSystemTime'
  )}"}]]`;
  api(
    'getSystemTime',
    reqStr,
    (res) => {
      console.log(res);
    },
    (code, message) => {
      console.log(code, message);
    }
  );
};

export const reqMemberInfo = (callback: any, timeout: any) => {
  let timer: any;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  (window as any).tds_reqMemberInfo = function(result: any) {
    clear();
    typeof callback === 'function' && callback(result);
  };

  if (timeout) {
    timer = setTimeout(() => {
      clear();
      typeof callback === 'function' && callback();
    }, timeout);
  }
  var type = 'tds.req.system.user.member.info';
  var reqStr = `["tds_req", [{"req": "${Base64.encode(
    JSON.stringify({type: type})
  )}", "callback": "${Base64.encode('tds_reqMemberInfo')}"}]]`;
  api(
    'reqMemberInfo',
    reqStr,
    (res) => {
      console.log('reqMemberInfo : ', res);
    },
    (code, message) => {
      console.log('reqMemberInfo : ', code, message);
    }
  );
};

// 打开期货详情界面
export const openFutureDetails = (cond: {
  pageParam: string;
  pageName: string;
}) => {
  var type = 'tds.req.system.open.page.comm';
  var reqStr = `["tds_req", [{
    "req": "${Base64.encode(JSON.stringify({type, cond}))}", 
    "callback": "${Base64.encode('openFutureDetails')}",
  }]]`;
  api(
    'openFutureDetails',
    reqStr,
    (res) => {
      console.log('openFutureDetails : ', res);
    },
    (code, message) => {
      console.log('openFutureDetails : ', code, message);
    }
  );
};

export const openPage = function(pageInfo: any) {
  pageInfo = pageInfo || {};
  if (!pageInfo.name) {
    return;
  }
  var req = ['open_page', [pageInfo]];
  api('open_page', JSON.stringify(req), (res) => {
    console.log(`open qb page ${pageInfo.name}`, res);
  });
};

export const getLanguage = (success?: SuccessType, failure?: FailType) => {
  if (!inQb()) {
    typeof failure === 'function' && (failure as any)();
    return;
  }
  (window as any).tds_getLanguage = function(result: any) {
    var {language} = result || {};
    typeof success === 'function' && (success as any)(language);
  };
  var reqStr = `["tds_req", [{"req": "eyJ0eXBlIjoidGRzLnJlcS5zeXN0ZW0ubGFuZ3VhZ2UuaW5mbyJ9", "callback": "${Base64.encode(
    'tds_getLanguage'
  )}"}]]`;
  api(
    'getLanguage',
    reqStr,
    (res) => {
      console.log(res);
    },
    (code, message) => {
      console.log(code, message);
      typeof failure === 'function' && (failure as any)();
    }
  );
};

// 浏览器页签切换通知 注册
export const qbApiVisibilityChangeAdd = (
  success?: SuccessType,
  failure?: FailType
) => {
  if (!inQb()) {
    typeof failure === 'function' && (failure as any)();
    return;
  }
  (window as any).qbPushVisibilityChange = function(result: any) {
    // console.log('这是自定义的回调函数：', result);
    typeof success === 'function' && (success as any)(result);
  };
  const reqStr = `["tds_reg", [{"req": "eyJ0eXBlIjoidGRzLnB1c2gudmlzaWJpbGl0eWNoYW5nZSJ9", "callback": "${Base64.encode(
    'qbPushVisibilityChange'
  )}"}]]`;
  api(
    'qbApiVisibilityChangeAdd',
    reqStr,
    (res) => console.log(res),
    (code, message) =>
      typeof failure === 'function' && (failure as any)(code, message)
  );
};

// 浏览器页签切换通知 反注册
export const qbApiVisibilityChangeRemove = (
  success?: SuccessType,
  failure?: FailType
) => {
  if (!inQb()) {
    typeof failure === 'function' && (failure as any)();
    return;
  }
  const reqStr = `["tds_unreg", [{"req": "eyJ0eXBlIjoidGRzLnB1c2gudmlzaWJpbGl0eWNoYW5nZSJ9", "callback": "${Base64.encode(
    'qbPushVisibilityChange'
  )}"}]]`;
  api(
    'qbApiVisibilityChangeRemove',
    reqStr,
    (res) => typeof success === 'function' && (success as any)(res),
    (code, message) =>
      typeof failure === 'function' && (failure as any)(code, message)
  );
};

// 打开客服聊天室
export const openCustomService = () => {
  const reqStr = `["open_page", [{"name":"customService"}]]`;
  api(
    'openCustomService',
    reqStr,
    (res) => {
      console.log('openCustomService : ', res);
    },
    (code, message) => {
      console.log('openCustomService : ', code, message);
    }
  );
};

// 查询、新增、删除 菜单
export const manageCollectedMenu = (
  data: {
    action: 'qry' | 'add' | 'del';
    pageid?: number;
  },
  success?: SuccessType,
  failure?: any
) => {
  const {action, pageid} = data;

  (window as any).handleCollectedMenu = function(res: any) {
    console.log('window.handleCollectedMenu : ', res);
    typeof success === 'function' && success(res);
  };

  let objStr = `{"data":"MyFavorites","callback":"handleCollectedMenu","action":"${action}"`;
  if (pageid) {
    objStr += `,"pageid":${pageid}`;
  }
  objStr += `}`;
  const reqStr = `["req_cache",[${objStr}]]`;
  api(
    'manageCollectedMenu',
    reqStr,
    (res) => {
      // let result = JSON.parse(res);
      // (success as any)(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};

// 查询、新增、删除 菜单
export const queryMenuPermission = (
  data: null,
  success?: SuccessType,
  failure?: any
) => {
  (window as any).handleMenuPermission = function(res: any) {
    console.log('window.handleMenuPermission : ', res);
    typeof success === 'function' && success(res);
  };

  const reqStr = `["req_cache",[{"data":"MenuPermission","callback":"handleMenuPermission"}]]`;
  api(
    'queryMenuPermission',
    reqStr,
    (res) => {
      // let result = JSON.parse(res);
      // (success as any)(result);
    },
    (error_code, error_message) => {
      failure({
        errorCode: error_code,
        errorMessage: error_message
      });
    }
  );
};
