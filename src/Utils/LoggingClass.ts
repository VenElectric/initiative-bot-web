// import { CollectionTypes } from "../Interfaces/ContextEnums";
// import { emitData } from "./SocketEmit";
// import { socket } from "../Context/SocketContext";
// const dayjs = require("dayjs");
// const { LEVEL } = require("triple-beam");
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// require("dotenv").config();

// enum LoggingTypes {
//   EMERGENCY = "EMERGENCY",
//   ALERT = "ALERT",
//   CRITICAL = "CRITICAL",
//   ERROR = "ERROR",
//   WARN = "WARN",
//   NOTICE = "NOTICE",
//   INFO = "INFO",
//   DEBUG = "DEBUG",
// }

// export function errorCheck(
//   error: any,
//   data: any,
//   sessionId: string,
//   logTypes: LoggingTypes[]
// ) {
//   if (error instanceof Error) {
//     logTypes.forEach((type: LoggingTypes) => {
//       if (type === LoggingTypes.DEBUG) {
//         weapon_of_logging.DEBUG(
//           error.name,
//           error.message,
//           data,
//           sessionId
//         )
//       } else {
//         weapon_of_logging[type](
//           error.name,
//           error.message,
//           error.stack,
//           data,
//           sessionId
//         );
//       }
//     });
//   }
// }

// export const weapon_of_logging = {
//   async [LoggingTypes.EMERGENCY](
//     errorName: any,
//     errorMessage: any,
//     stackTrace: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: errorName,
//       errorMessage: errorMessage,
//       data: data,
//       stackTrace: stackTrace,
//     };

//     await emitData(
//       socket,
//       LoggingTypes.EMERGENCY,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.ALERT](
//     errorName: any,
//     errorMessage: any,
//     stackTrace: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: errorName,
//       errorMessage: errorMessage,
//       data: data,
//       stackTrace: stackTrace,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.ALERT,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.CRITICAL](
//     errorName: any,
//     errorMessage: any,
//     stackTrace: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: errorName,
//       errorMessage: errorMessage,
//       stackTrace: stackTrace,
//       data: data,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.CRITICAL,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.ERROR](
//     errorName: any,
//     errorMessage: any,
//     stackTrace: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: errorName,
//       errorMessage: errorMessage,
//       stackTrace: stackTrace,
//       data: data,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.ERROR,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.WARN](
//     errorName: any,
//     errorMessage: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: errorName,
//       errorMessage: errorMessage,
//       data: data,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.WARN,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.NOTICE](
//     noticeName: any,
//     noticeMessage: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       errorName: noticeName,
//       errorMessage: noticeMessage,
//       data: data,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.NOTICE,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.INFO](
//     infoName: any,
//     infoMessage: any,
//     data: any,
//     sessionId: string
//   ) {
//     let options = {
//       infoName: infoName,
//       infoMessage: infoMessage,
//       data: data,
//     };
//     await emitData(
//       socket,
//       LoggingTypes.INFO,
//       sessionId,
//       async (data: any) => {
//         console.log(data);
//       },
//       options,
//       CollectionTypes.LOGGING
//     );
//   },
//   async [LoggingTypes.DEBUG](
//     debugName: any,
//     debugMessage: any,
//     data: any,
//     sessionId: string,
//   ) {
//     let options = {
//       id: uuidv4(),
//       level: LoggingTypes.DEBUG,
//       [LEVEL]: LoggingTypes.DEBUG,
//       debugName: debugName,
//       debugMessage: debugMessage,
//       data: data,
//       date: dayjs(),
//     };
//     try {
//       await emitData(
//         socket,
//         LoggingTypes.DEBUG,
//         sessionId,
//         async (data: any) => {
//           console.log(data);
//         },
//         options,
//         CollectionTypes.LOGGING
//       );
//       console.error(options);
//     } catch (error) {
//       console.error(options);
//       console.error(error);
//       return;
//     }
//   },
// };
