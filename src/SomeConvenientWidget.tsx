import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

const messages: Record<string, string> = {
  "Loading.First": "Виджет грузится",
  "Loading.Second": "Виджет ещё грузится",
  "Loading.Third": "Загрузка идёт дольше чем обычно. Пожалуйста, подождите",
  "Error.Timeout": "Ошибка при загрузке. Пожалуйста -- обновите окно",
  "Success.LoadingFinished": "Виджет загружен!",
};

const enum Time {
  Fastest = 3000,
  Fast = 6000,
  Slow = 8000,
  Slowest = 10000,
}

export const SomeConvenientWidget: React.FC = () => {
  const [message, setMessage] = React.useState(messages["Loading.First"]);

  const fakeApi = new Promise<string>((resolve, reject) =>
    setTimeout(() => resolve("Success.LoadingFinished"), Time.Slow)
  );

  const timeoutApi = new Promise<string>((_, reject) =>
    setTimeout(() => reject("Error.Timeout"), Time.Slowest)
  );

  const timeouts = React.useMemo(
    () => [
      setTimeout(() => {
        setMessage(messages["Loading.Second"]);
      }, Time.Fastest),
      setTimeout(() => {
        setMessage(messages["Loading.Third"]);
      }, Time.Fast),
    ],
    []
  );

  React.useEffect(() => {
    Promise.race([fakeApi, timeoutApi])
      .then((value) => setMessage(messages[value]))
      .catch((value) => setMessage(messages[value]))
      .finally(() => timeouts.forEach(clearTimeout));
  });

  return (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress />
      <span>{message}</span>
    </Stack>
  );
};
