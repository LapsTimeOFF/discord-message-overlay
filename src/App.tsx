/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import useQueryParams from "./hooks/useQueryParams";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Markdown from "markdown-to-jsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EmbedVisualizer } from "embed-visualizer";
import "embed-visualizer/dist/index.css";
import twemoji from "twemoji";

export interface Message {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: Author;
  attachments: Attachment[];
  embeds: Embed[];
  mentions: any[];
  mention_roles: any[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: Date;
  edited_timestamp: Date | null;
  flags: number;
  components: any[];
  reactions?: Reaction[];
  application_id?: string;
  interaction?: Interaction;
  webhook_id?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  width: number;
  height: number;
  content_type: string;
}

export interface Author {
  id: string;
  username: string;
  global_name: null;
  display_name: null;
  avatar: string;
  discriminator: string;
  public_flags: number;
  avatar_decoration: null;
  bot?: boolean;
}

export interface Embed {
  type: string;
  title: string;
  description?: string;
  color: number;
  timestamp: Date;
  fields: Field[];
}

export interface Field {
  name: string;
  value: string;
  inline: boolean;
}

export interface Interaction {
  id: string;
  type: number;
  name: string;
  user: Author;
}

export interface Reaction {
  emoji: Emoji;
  count: number;
  count_details: CountDetails;
  burst_colors: any[];
  me_burst: boolean;
  me: boolean;
  burst_count: number;
}

export interface CountDetails {
  burst: number;
  normal: number;
}

export interface Emoji {
  id: null;
  name: string;
}

function App() {
  const query = useQueryParams();
  const [data, setData] = useState<[] | Message[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) return;

      const req = await fetch(
        `https://discord.com/api/v9/channels/${
          query.find((r) => r.key === "channelId")?.value
        }/messages`,
        {
          headers: {
            authorization: `${query.find((r) => r.key === "token")?.value}`,
          },
        }
      );

      const res = await req.json();

      setData(res);

      twemoji.parse(document.body, {
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <Container>
      {data !== undefined
        ? data
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() +
                new Date(b.timestamp).getTime()
            )
            .map((message) => (
              <Card
                key={message.id}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "#fff",
                  my: 1,
                }}
              >
                <CardContent>
                  <img
                    src={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=64`}
                    style={{ borderRadius: "100px", marginRight: "10px" }}
                  />
                  {message.author.username}:{" "}
                  <Markdown
                    options={{
                      overrides: {
                        p: "span",
                      },
                    }}
                  >
                    {message.content}
                  </Markdown>
                  {message.attachments.map((attachment) => (
                    <img
                      key={attachment.id}
                      src={attachment.url}
                      style={{ width: "100%" }}
                    />
                  ))}
                  <Stack direction="row" spacing={1}>
                    {message.reactions?.map((reaction) => (
                      <Box
                        key={reaction.emoji.name}
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          borderRadius: "10px",
                          p: 1,
                          border: "1px solid #fff",
                        }}
                      >
                        <Typography>
                          {reaction.emoji.name} {reaction.count}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  {message.embeds.map((embed) => (
                    <EmbedVisualizer
                      key={embed.title}
                      embed={{
                        embed: {
                          title: embed.title,
                          description: embed.description,
                          color: embed.color,
                          fields: embed.fields,
                        },
                      }}
                      onError={(e: any) =>
                        console.error(e, {
                          embed: {
                            title: embed.title,
                            description: embed.description,
                            color: embed.color,
                            fields: embed.fields,
                          },
                        })
                      }
                    />
                  ))}
                </CardContent>
              </Card>
            ))
        : ""}
    </Container>
  );
}

export default App;
