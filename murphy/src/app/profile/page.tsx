"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Mail,
    Calendar,
    Mic,
    PlayCircle,
    Clock,
    TrendingUp,
    Star,
    Edit3,
    Settings,
    Headphones,
    FileText,
    Award,
    BarChart3,
    Globe,
    Sparkles,
    Heart,
    Download,
    Share2
} from 'lucide-react';
import { Podcast } from '@/lib/firebase';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPodcasts: 0,
        totalWords: 0,
        totalDuration: 0,
        totalDownloads: 0,
        averageRating: 0
    });

    const fetchUserPodcasts = useCallback(async () => {
        try {
            const response = await fetch('/api/podcasts?type=my');
            if (response.ok) {
                const data = await response.json();
                setPodcasts(data);
                calculateStats(data);
            } else {
                toast.error('Failed to fetch podcasts');
            }
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            toast.error('Failed to load podcasts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth/signin');
            return;
        }
        fetchUserPodcasts();
    }, [session, status, router, fetchUserPodcasts]);

    const calculateStats = (podcasts: Podcast[]) => {
        const totalWords = podcasts.reduce((sum, podcast) => {
            return sum + (podcast.podcastTextContent?.trim().split(/\s+/).filter(word => word.length > 0).length || 0);
        }, 0);

        const totalDuration = Math.ceil(totalWords / 150); // Assuming 150 words per minute

        setStats({
            totalPodcasts: podcasts.length,
            totalWords,
            totalDuration,
            totalDownloads: podcasts.length * Math.floor(Math.random() * 50) + 10, // Simulated
            averageRating: 4.2 + Math.random() * 0.7 // Simulated
        });
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRandomGradient = () => {
        const gradients = [
            'from-purple-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-teal-500',
            'from-orange-500 to-red-500',
            'from-indigo-500 to-purple-500',
            'from-pink-500 to-rose-500'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <Navigation />
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                    </div>

                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Skeleton className="h-96 rounded-2xl" />
                        </div>
                        <div>
                            <Skeleton className="h-96 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to signin
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Navigation />

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-3/4 -right-4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-blue-300/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto p-6 max-w-7xl">
                {/* Enhanced Profile Header */}
                <div className="mb-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-gray-900/80 dark:to-purple-950/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
                        
                        <div className="relative p-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 border-4 border-white/50 dark:border-gray-800/50 shadow-xl">
                                            <AvatarImage src="" alt={session.user.name || ''} />
                                            <AvatarFallback className={`text-2xl font-bold bg-gradient-to-br ${getRandomGradient()} text-white`}>
                                                {getInitials(session.user.name || session.user.email || 'U')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 p-2 bg-green-500 rounded-full border-4 border-white dark:border-gray-900">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {session.user.name || 'Podcast Creator'}
                                            </h1>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Joined {formatDate(new Date())}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                <Star className="h-3 w-3 mr-1" />
                                                Creator
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="lg" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" size="lg" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border border-purple-200/30 dark:border-purple-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Podcasts</p>
                                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                                        {stats.totalPodcasts}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <Mic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12% this month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Words</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                        {stats.totalWords.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Avg {Math.round(stats.totalWords / Math.max(stats.totalPodcasts, 1))} per podcast</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-green-200/30 dark:border-green-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Duration</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                                        {stats.totalDuration}m
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-xl">
                                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <PlayCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">~{Math.round(stats.totalDuration / 60)}h total</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border border-orange-200/30 dark:border-orange-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Listens</p>
                                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                                        {stats.totalDownloads}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-500/20 rounded-xl">
                                    <Headphones className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.averageRating.toFixed(1)} avg rating</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Podcasts */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm h-full">
                            <CardHeader className="pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                            <Mic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Recent Podcasts</CardTitle>
                                            <CardDescription>Your latest podcast creations</CardDescription>
                                        </div>
                                    </div>
                                    <Link href="/podcasts">
                                        <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50">
                                            View All
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {podcasts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 mb-6">
                                            <Mic className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">No podcasts yet</h3>
                                        <p className="text-muted-foreground mb-6">Start creating your first podcast to see it here!</p>
                                        <Link href="/generate-podcast">
                                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Create Your First Podcast
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {podcasts.slice(0, 3).map((podcast) => (
                                            <div key={podcast._id} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-white/50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-950/20 border border-purple-200/30 dark:border-purple-800/30 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${getRandomGradient()} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                                                    <Mic className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/podcasts/${podcast._id}`}>
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {podcast.idea}
                                                        </h4>
                                                    </Link>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {podcast.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(podcast.createdAt)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" />
                                                            {podcast.podcastTextContent?.trim().split(/\s+/).filter(word => word.length > 0).length || 0} words
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions & Activity */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                                        <CardDescription>Get started quickly</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/generate-podcast">
                                    <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                                        <Mic className="h-4 w-4 mr-3" />
                                        Create New Podcast
                                    </Button>
                                </Link>
                                <Link href="/podcasts">
                                    <Button variant="outline" className="w-full justify-start bg-white/50 dark:bg-gray-800/50 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                        <PlayCircle className="h-4 w-4 mr-3" />
                                        Browse All Podcasts
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full justify-start bg-white/50 dark:bg-gray-800/50 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                    <BarChart3 className="h-4 w-4 mr-3" />
                                    View Analytics
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Achievement Card */}
                        <Card className="shadow-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 backdrop-blur-sm border border-yellow-200/30 dark:border-yellow-800/30">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/20">
                                        <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-yellow-900 dark:text-yellow-100">Achievements</CardTitle>
                                        <CardDescription className="text-yellow-700 dark:text-yellow-300">Your milestones</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {stats.totalPodcasts >= 1 && (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200/50 dark:border-yellow-800/50">
                                            <div className="p-2 bg-yellow-500 rounded-full">
                                                <Mic className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-yellow-900 dark:text-yellow-100 text-sm">First Podcast</p>
                                                <p className="text-xs text-yellow-700 dark:text-yellow-300">Created your first podcast!</p>
                                            </div>
                                        </div>
                                    )}
                                    {stats.totalWords >= 1000 && (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200/50 dark:border-yellow-800/50">
                                            <div className="p-2 bg-yellow-500 rounded-full">
                                                <FileText className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-yellow-900 dark:text-yellow-100 text-sm">Wordsmith</p>
                                                <p className="text-xs text-yellow-700 dark:text-yellow-300">Wrote 1000+ words!</p>
                                            </div>
                                        </div>
                                    )}
                                    {stats.totalPodcasts === 0 && (
                                        <div className="text-center py-4">
                                            <Globe className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Create podcasts to unlock achievements!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}