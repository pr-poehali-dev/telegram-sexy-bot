import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface DiscordChannel {
  id: string;
  name: string;
  server: string;
  connected: boolean;
  messagesCount: number;
  lastMessage?: string;
  status: 'active' | 'paused' | 'error';
}

interface Notification {
  id: string;
  channel: string;
  message: string;
  time: string;
  type: 'message' | 'media' | 'mention';
}

const Index = () => {
  const [channels, setChannels] = useState<DiscordChannel[]>([
    {
      id: '1',
      name: 'general',
      server: 'Dev Community',
      connected: true,
      messagesCount: 1243,
      lastMessage: 'Hey everyone! New update is live',
      status: 'active'
    },
    {
      id: '2',
      name: 'announcements',
      server: 'Gaming Hub',
      connected: true,
      messagesCount: 567,
      lastMessage: 'Server maintenance tonight',
      status: 'active'
    },
    {
      id: '3',
      name: 'random',
      server: 'Friends',
      connected: false,
      messagesCount: 89,
      status: 'paused'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      channel: 'general',
      message: 'New feature release announcement',
      time: '2 min ago',
      type: 'message'
    },
    {
      id: '2',
      channel: 'announcements',
      message: 'Server maintenance scheduled',
      time: '15 min ago',
      type: 'mention'
    },
    {
      id: '3',
      channel: 'general',
      message: 'Image uploaded: screenshot.png',
      time: '1 hour ago',
      type: 'media'
    }
  ]);

  const toggleChannel = (id: string) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, connected: !ch.connected, status: !ch.connected ? 'active' : 'paused' } : ch
    ));
    toast.success(!channels.find(ch => ch.id === id)?.connected ? 'Канал подключен' : 'Канал отключен');
  };

  const totalMessages = channels.reduce((sum, ch) => sum + ch.messagesCount, 0);
  const activeChannels = channels.filter(ch => ch.connected).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'MessageSquare';
      case 'media': return 'Image';
      case 'mention': return 'AtSign';
    }
  };

  const getStatusColor = (status: DiscordChannel['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
              <Icon name="Zap" className="text-white" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
              Discord → Telegram Bridge
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Управляй потоком сообщений между платформами в реальном времени
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon name="Activity" className="text-primary" size={32} />
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{activeChannels}</div>
              <p className="text-sm text-muted-foreground">Активных каналов</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon name="MessageCircle" className="text-secondary" size={32} />
                <Icon name="TrendingUp" className="text-green-500" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalMessages.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Всего сообщений</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon name="Bell" className="text-accent" size={32} />
                <Badge className="gradient-accent text-white border-0">{notifications.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">Онлайн</div>
              <p className="text-sm text-muted-foreground">Система работает</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Link" className="text-primary" />
                    Подключенные каналы
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Управление синхронизацией Discord каналов
                  </CardDescription>
                </div>
                <Button className="gradient-primary text-white border-0 hover:opacity-90">
                  <Icon name="Plus" size={20} />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels.map((channel) => (
                <div 
                  key={channel.id}
                  className="p-4 rounded-xl border-2 bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {channel.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-lg flex items-center gap-2">
                          #{channel.name}
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(channel.status)}`} />
                        </div>
                        <div className="text-sm text-muted-foreground">{channel.server}</div>
                      </div>
                    </div>
                    <Switch 
                      checked={channel.connected}
                      onCheckedChange={() => toggleChannel(channel.id)}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="MessageSquare" size={16} />
                        {channel.messagesCount}
                      </span>
                      {channel.status === 'active' && (
                        <Badge variant="secondary" className="text-xs">
                          <Icon name="Zap" size={12} className="mr-1" />
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>

                  {channel.lastMessage && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground line-clamp-1">
                      {channel.lastMessage}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Bell" className="text-accent" />
                Последние уведомления
              </CardTitle>
              <CardDescription className="mt-2">
                Live-поток сообщений из Discord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 rounded-xl border-2 bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Icon name={getNotificationIcon(notification.type)} className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          #{notification.channel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full mt-4 border-2 hover:bg-accent/5"
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Загрузить еще
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                  <Icon name="Send" className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Telegram Bot подключен</h3>
                  <p className="text-sm text-muted-foreground">
                    Все сообщения автоматически пересылаются в @your_bot
                  </p>
                </div>
              </div>
              <Button variant="outline" className="border-2">
                <Icon name="Settings" size={18} className="mr-2" />
                Настроить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
