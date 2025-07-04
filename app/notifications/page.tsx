import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationSettings } from '@/components/NotificationSettings';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Settings,
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getUserNotifications(userId: string) {
  // Mock notifications for now
  return [
    {
      id: '1',
      type: 'alert',
      title: 'Water Quality Alert',
      message: 'High turbidity detected in your latest sample',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Analysis Complete',
      message: 'Your water sample analysis is ready for review',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '3',
      type: 'success',
      title: 'Safe Water Detected',
      message: 'Your latest sample meets all safety standards',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
    },
  ];
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to view your notifications.
            </p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const notifications = await getUserNotifications(session.user.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your water quality alerts and updates
          </p>
        </div>
        <Link href="/notifications/settings">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread Notifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === 'success').length}
              </p>
              <p className="text-sm text-gray-600">Safe Results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={getNotificationBadge(notification.type)}
                    >
                      {notification.type}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {format(notification.createdAt, 'MMM dd, yyyy HH:mm')}
                    </span>
                    
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {notifications.length === 0 && (
          <Card>
            <CardContent className="text-center p-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-gray-600 mb-6">
                You'll receive notifications here when there are updates about your water quality tests.
              </p>
              <Link href="/camera">
                <Button>Take First Sample</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Notification Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 