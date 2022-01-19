import { FastifyReply } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { config } from '../constants';
import { FTSARequest } from '../models';
import { getRedisConnection } from '../utils/redis.utils';
import { sendSuccessResponse } from '../utils/response.utils';

@Controller({ route: '/' })
export default class HomeController {
  @GET({ url: '/' })
  async indexHandler(req: FTSARequest, res: FastifyReply) {
    return sendSuccessResponse(res);
  }

  @GET({ url: '/create-schema' })
  async createHandler(req: FTSARequest, res: FastifyReply) {
    const redis = await getRedisConnection();
    console.log(redis);
    const index = await redis.search_module_create(
      'testindex',
      'HASH',
      [
        {
          name: 'term',
          type: 'TEXT',
          weight: 20
        },
        {
          name: 'numVal',
          type: 'NUMERIC',
          sortable: true
        }
      ],
      {
        language: 'turkish',
        prefix: {
          prefixes: config.redis.keyPrefix + 'doc',
          num: 1
        }
      }
    );
    return sendSuccessResponse(res, { result: index });
  }

  @POST({ url: '/insert-data' })
  async insertData(req: FTSARequest, res: FastifyReply) {
    const redis = await getRedisConnection();
    const data = `Beahan-Cassin
    "Nader, Bins and Yost"
    Gutmann-Jast
    "Daniel, Hermann and Lakin"
    Kling and Sons
    "Metz, Beahan and Wehner"
    Champlin-Nolan
    Klein and Sons
    Ernser Inc
    Kertzmann Inc
    "Fay, Rogahn and Durgan"
    "Hirthe, Kiehn and Ankunding"
    Cummings-Lowe
    "Krajcik, Schumm and Hills"
    Pacocha and Sons
    Rohan-Wilkinson
    Kuhn and Sons
    "Hammes, Quitzon and Huel"
    West-Hodkiewicz
    Heller-Nitzsche
    "Shanahan, Kertzmann and Mayert"
    "Steuber, Turner and Collins"
    Lesch Group
    Hahn and Sons
    Gutmann LLC
    Koch Inc
    Goyette-Osinski
    Botsford-Huels
    Swift-O'Kon
    Reynolds Inc
    "Kihn, O'Hara and Satterfield"
    "Mohr, Bashirian and Willms"
    "Ernser, Rippin and Sipes"
    Metz-Jaskolski
    "Schroeder, Barrows and Oberbrunner"
    Kuphal-Howell
    Hintz Inc
    Parisian-Walker
    Hagenes Group
    Nader-Nolan
    Stark-Bernier
    Mohr-Reilly
    Trantow-Turner
    Pfannerstill Inc
    "Pacocha, Kshlerin and Koelpin"
    Pacocha LLC
    Reichel-Dach
    Romaguera-Schaefer
    Block-Padberg
    "Rutherford, Howe and Walker"
    "Swaniawski, Kling and Spencer"
    "Schuppe, Metz and Frami"
    Lueilwitz Group
    Fahey Inc
    "Hane, Durgan and Zboncak"
    Harber-Schaefer
    Aufderhar-Hoppe
    Crooks LLC
    Heidenreich-Jacobi
    Rogahn Inc
    Thiel LLC
    Osinski-Erdman
    Towne-Harvey
    Ward-Yundt
    Bernhard Inc
    Nolan and Sons
    "Harber, O'Hara and Frami"
    Wehner and Sons
    Medhurst-Bogisich
    Feil-Beer
    "Bosco, Stamm and Gaylord"
    Bartell Group
    "Kirlin, Boehm and Nienow"
    VonRueden Group
    Kessler and Sons
    Wunsch LLC
    Bode Inc
    Dooley-Farrell
    Bartoletti-Turcotte
    Abshire-Effertz
    Corkery Group
    Volkman-Brakus
    Ondricka-Pfannerstill
    Romaguera Inc
    "Johnston, Lockman and Yost"
    Vandervort LLC
    Grant-Anderson
    Tromp-Skiles
    "Mertz, Barrows and Leannon"
    Mosciski LLC
    Cartwright-Mann
    Gleichner-Hane
    Streich Inc
    Dare-Lebsack
    Baumbach-Boehm
    "Conn, Daugherty and Grant"
    "Strosin, Ferry and Halvorson"
    Marvin-Gislason
    Douglas Group
    "Bernier, Hane and Mante"`;
    const terms = data.split('\n').map(t => t.trim());
    terms.forEach((term, i) => {
      redis.redis.hset(`doc:${i}`, {
        term,
        numVal: i
      });
    });
    // const { terms } = req.body as any;
    sendSuccessResponse(res, { result: terms });
  }

  @GET({ url: '/search' })
  async searchHandler(req: FTSARequest, res: FastifyReply) {
    const redis = await getRedisConnection();
    const { q } = req.query as any;
    const [count, ...rest] = (await redis.search_module_search('testindex', decodeURIComponent(q), {
      language: 'turkish'
    })) as unknown as [number, ...any];

    const convertArrayToPairs = (arr: any[]) => {
      return arr.reduce((result, _value, index, array) => {
        if (index % 2 === 0) result.push(array.slice(index, index + 2));
        return result;
      }, []);
    };

    const convertPairedArrayToObject = (arrayWithPairs: any[]) => {
      return convertArrayToPairs(arrayWithPairs).reduce((resultObj: any, curr: [any, any]) => {
        return {
          ...resultObj,
          [curr[0]]: curr[1]
        };
      }, {});
    };

    const convertPairedArrayToList = (arrayWithPairs: any[]) => {
      const newArr = [];
      for (let i = 0; i < arrayWithPairs.length; i++) {
        if (i % 2 > 0) {
          continue;
        }
        newArr.push({
          key: arrayWithPairs[i],
          val: convertPairedArrayToObject(arrayWithPairs[i + 1])
        });
      }
      return newArr;
    };

    sendSuccessResponse(res, { count, result: convertPairedArrayToList(rest) });
  }
}
