"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { ScrollArea } from "./ui/scroll-area";

const Chat = () => {
  const { messages, handleInputChange, handleSubmit, input, setInput } =
    useChat({
      api: "/api/chat",
    });

  useEffect(() => {
    setInput("ola");
  }, [setInput]);

  useEffect(() => {
    const scrollAnchor = document.getElementById("scrollAnchor");

    if (messages && messages.length >= 2 && messages[1].role && scrollAnchor) {
      scrollAnchor.scrollTop = scrollAnchor.scrollHeight;
      console.log(messages[1].role);
    }
  }, [messages]);

  return (
    <Card className="w-[600px] ">
      <CardHeader>
        <CardTitle>SC.AI</CardTitle>
        <CardDescription>Fale com o SC.AI e tire suas duvidas</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[500px] space-y-4 pr-4">
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className="flex gap-3 text-slate-600 text-sm mb-4"
              >
                {message.role === "user" && (
                  <Avatar>
                    <AvatarFallback>DF</AvatarFallback>
                    <AvatarImage src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" />
                  </Avatar>
                )}
                {message.role === "assistant" && (
                  <Avatar>
                    <AvatarFallback>DF</AvatarFallback>
                    <AvatarImage src="https://cdn.icon-icons.com/icons2/3250/PNG/512/bot_filled_icon_202506.png" />
                  </Avatar>
                )}
                <p className="leading-relaxed">
                  <span className="block font-bold text-slate-800">
                    {message.role === "user" ? "Usuário" : "SC.AI"}
                  </span>
                  {message.content}
                </p>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Como posso ajudar?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
