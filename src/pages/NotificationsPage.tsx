import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Mail,
  Smartphone,
  Clock,
  Filter,
  MoreVertical
} from 'lucide-react';

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('medium');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Water Quality Alert',
      message: 'High chlorine levels detected in Kitchen Tap sample',
      timestamp: '2024-01-15 14:30',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Analysis Complete',
      message: 'Your Bathroom Sink water sample analysis is ready',
      timestamp: '2024-01-15 09:15',
      read: true,
      priority: 'low'
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly Report',
      message: 'Your weekly water quality summary is available',
      timestamp: '2024-01-14 08:00',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Filter Maintenance',
      message: 'Consider replacing water filter based on recent test results',
      timestamp: '2024-01-13 16:45',
      read: false,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'success',
      title: 'Improvement Detected',
      message: 'Water quality has improved since last test',
      timestamp: '2024-01-12 11:20',
      read: true,
      priority: 'low'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (id: number) => {
    console.log(`Marking notification ${id} as read`);
  };

  const deleteNotification = (id: number) => {
    console.log(`Deleting notification ${id}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Notifications</h1>
                <p className="text-gray-600">
                  Manage your alerts and notification preferences
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadCount} unread
                    </span>
                  )}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        {/* Notification Settings */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delivery Methods */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Delivery Methods</h3>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Get alerts via email</div>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-600">Get alerts on your device</div>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>

              {/* Alert Thresholds */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Alert Sensitivity</h3>
                
                <div className="space-y-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <label key={level} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70">
                      <input
                        type="radio"
                        name="threshold"
                        value={level}
                        checked={alertThreshold === level}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium capitalize">{level} Sensitivity</div>
                        <div className="text-sm text-gray-600">
                          {level === 'low' && 'Only critical water quality issues'}
                          {level === 'medium' && 'Important quality changes and issues'}
                          {level === 'high' && 'All water quality changes and updates'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Filter */}
        <Card className="glass border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter notifications:</span>
                <div className="flex gap-2">
                  {['all', 'unread', 'warnings', 'success'].map((filter) => (
                    <Button
                      key={filter}
                      variant="outline"
                      size="sm"
                      className="glass capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="glass">
                Mark all as read
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Notifications ({notifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <Badge className={getPriorityBadge(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                          className="glass"
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet.</p>
                <p className="text-sm text-gray-400">You'll see water quality alerts and updates here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="glass">
                <Bell className="w-4 h-4 mr-2" />
                Test Notifications
              </Button>
              <Button variant="outline" className="glass">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
              <Button variant="outline" className="glass">
                <Mail className="w-4 h-4 mr-2" />
                Email Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 