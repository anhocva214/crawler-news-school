import axios from "axios";
import { discordHookURL } from "@shared/constants";

const COLORS: { [key: string]: number } = {
  ctkt: 15291505,
  pdt: 7427305,
  ctsv: 7858516,
  other: 5561833,
};

export async function sendDiscordHook(data: {
  subject: string;
  title: string;
  time: string;
  url: string;
  channelCode: string;
}) {
  const { subject, title, time, url, channelCode } = data;
  const timeArr = time.replace('-','/').split("/").map((e) => parseInt(e));
  const timestamp = new Date(timeArr[2], timeArr[1], timeArr[0]);
  const payload = {
    content: null,
    embeds: [
      {
        title,
        url,
        color: COLORS[channelCode],
        footer: {
          text: subject,
        },
        timestamp,
      },
    ],
  };
  for (const URL of discordHookURL) {
    await axios.post(URL, payload);
  }
  console.log('Send payload to',discordHookURL.length,'channels')
}
