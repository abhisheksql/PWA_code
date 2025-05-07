'use client';
import '../../../../public/style/teacher.css';
import { useEffect } from 'react';
import { useChapterAssignTimeline } from '../../hooks/teacher/useChapterAssignTimeline';
import { useSearchParams } from "next/navigation";

export default function TimelineChart() {

  const searchParams = useSearchParams();
  const section_id = searchParams.get("section_id");
  const course_id = searchParams.get("course_id");
  const {chapterTimeline,loading: chapterTimelineLoading,error: chapterTimelineError} = useChapterAssignTimeline(section_id, course_id);

  useEffect(() => {
    const loadGoogleCharts = () => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        google.charts.load('current', { packages: ['timeline'] });
        google.charts.setOnLoadCallback(drawChart);
      };
      document.body.appendChild(script);
    };

    const drawChart = () => {
      const container = document.getElementById('example3.1');
      
      if (container && google && google.visualization) {
        const chart = new google.visualization.Timeline(container);
        const dataTable = new google.visualization.DataTable();
        
        dataTable.addColumn({ type: 'string', id: 'Chapter' });
        dataTable.addColumn({ type: 'string', id: 'Name' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });

        const rows = chapterTimeline?.map(chapter => [
          'Chapter', 
          chapter.chapter_name, 
          new Date(chapter.start_date * 1000),
          chapter.end_date ? new Date(chapter.end_date * 1000) : new Date() 
        ]);

        dataTable.addRows(rows);
        chart.draw(dataTable);
      }
    };

    if (!window.google) {
      loadGoogleCharts();
    } else {
      drawChart();
    }
  }, [chapterTimeline, chapterTimelineLoading, chapterTimelineError]);

  return <div id="example3.1" style={{ height: '200px' }}></div>;
}  