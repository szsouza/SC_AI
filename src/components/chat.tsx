"use client";
import React, { useEffect, useRef } from "react";
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
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const Chat = () => {
  const { messages, handleSubmit, input, setInput } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    setInput(`${id}`);
  }, [setInput]);

  const copyText = (text: string) => {
    // Cria um elemento de texto temporário (input) para copiar o texto
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);

    // Seleciona o texto dentro do elemento de texto temporário
    input.select();
    input.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o texto para a área de transferência
    document.execCommand("copy");

    // Remove o elemento de texto temporário
    document.body.removeChild(input);

    // Exibe uma mensagem ou realiza outra ação, se desejado
    alert("Texto copiado para a área de transferência: " + text);
  };

  return (
    <Card className="w-[600px] ">
      <CardHeader>
        <CardTitle>SC.AI</CardTitle>
        <CardDescription>Fale com o SC.AI e tire suas dúvidas</CardDescription>
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
                <div className=" flex-1 flex-col">
                  <p className="leading-relaxed">
                    <span className="block font-bold text-slate-800">
                      {message.role === "user" ? "Usuário" : "SC.AI"}
                    </span>
                    <span id="texto-copiar">{message.content}</span>
                  </p>
                  {message.role === "user" ? null : (
                    <Button
                      size={"sm"}
                      className="mt-3"
                      onClick={() => copyText(message.content)}
                    >
                      Copiar Justificativa
                    </Button>
                  )}
                </div>
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

          <Button type="submit">Enviar</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
