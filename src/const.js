// src/const.js
export const Status = {
  BACKLOG: "backlog",
  PROCESSING: "in-process",
  DONE: "done",
  TRASH: "trash",
};

export const StatusLabel = {
  [Status.BACKLOG]: "Бэклог",
  [Status.PROCESSING]: "В процессе",
  [Status.DONE]: "Готово",
  [Status.TRASH]: "Корзина",
};

// Типы действий пользователя
export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  CLEAR_TRASH: 'CLEAR_TRASH',
};

// Типы обновлений интерфейса
export const UpdateType = {
  PATCH: 'PATCH',    // Незначительное изменение (обновление одной задачи)
  MINOR: 'MINOR',    // Небольшое изменение (добавление/удаление одной задачи)
  MAJOR: 'MAJOR',    // Значительное изменение (очистка корзины, массовые операции)
  INIT: 'INIT'       // Первоначальная инициализация
};