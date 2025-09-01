import React from 'react';
// import ConnectionView from './ConnectionView';
import FollowView from './FollowView';
// import GroupsView from './GroupsView';
// import EventsView from './EventsView';
// import NewslettersView from './NewslettersView';
// import NotificationsView from './NotificationsView';
// import HashtagsView from './HashtagsView';
// import CompaniesView from './CompaniesView';
// import SchoolsView from './SchoolsView';

const MainContent = ({ activeTab }) => {
    const contentViews = {
        // connections: <ConnectionView />,
        followingfollowers: <FollowView />,
        // groups: <GroupsView />,
        // events: <EventsView />,
        // newsletters: <NewslettersView />,
        // notifications: <NotificationsView />,
        // hashtags: <HashtagsView />,
        // companies: <CompaniesView />,
        // schools: <SchoolsView />,
    };

    return (
        <main className="w-full lg:flex-1">
            {contentViews[activeTab]}
        </main>
    );
};

export default MainContent;