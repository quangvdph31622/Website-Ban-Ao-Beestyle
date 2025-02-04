import React, { useState, useCallback } from 'react';
import { Radio, DatePicker } from 'antd';
import { Moment } from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const { RangePicker } = DatePicker;

interface DateFilterProps {
    onFilterChange: (
        value: string | { from: string; to: string } | null,
        type: 'day' | 'month' | 'year' | 'range'
    ) => void;
}

const StatisticalDateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);
    const [filterType, setFilterType] = useState<'day' | 'month' | 'year' | 'range'>('day');
    const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
    const [selectedRange, setSelectedRange] = useState<[Moment, Moment] | null>(null);

    const handleFilterTypeChange = useCallback(
        (e: React.ChangeEvent<{ value: 'day' | 'month' | 'year' | 'range' }>) => {
            const newFilterType = e.target.value;
            if (newFilterType) {
                params.set("period", newFilterType);
                params.delete("periodValue")
            } else {
                params.delete("period");
            }
            replace(`${pathname}?${params.toString()}`);
            setFilterType(newFilterType);
            setSelectedDate(null);
            setSelectedRange(null);
            console.log(`Filter type changed to: ${newFilterType}`);
            // onFilterChange(null, newFilterType);
        },
        [onFilterChange]
    );

    const handleDateChange = useCallback(
        (date: Moment | null, dateString: string | string[]) => {
            setSelectedDate(date);
            console.log(`Selected date: ${date ? date.format('YYYY-MM-DD') : 'null'}`);
            if (date) {
                params.set("periodValue", date ? date.format('YYYY-MM-DD') : 'null');
            } else {
                params.delete("periodValue");
            }
            replace(`${pathname}?${params.toString()}`);
            onFilterChange(date ? date.format('YYYY-MM-dd') : null, 'day');
        },
        [onFilterChange]
    );

    const handleMonthChange = useCallback(
        (date: Moment | null, dateString: string | string[]) => {
            setSelectedDate(date);
            console.log(`Selected month: ${date ? date.format('YYYY') : 'null'}`);
            if (date) {
                params.set("periodValue", date ? date.format('YYYY') : 'null');
            } else {
                params.delete("periodValue");
            }
            replace(`${pathname}?${params.toString()}`);
            onFilterChange(date ? date.format('YYYY-MM') : null, 'month');
        },
        [onFilterChange]
    );

    const handleYearChange = useCallback(
        (date: Moment | null, dateString: string | string[]) => {
            setSelectedDate(date);
            console.log(`Selected year: ${date ? date.format('YYYY') : 'null'}`);
            if (date) {
                params.set("periodValue", date ? date.format('YYYY') : 'null');
            } else {
                params.delete("periodValue");
            }
            replace(`${pathname}?${params.toString()}`);
            onFilterChange(date ? date.format('YYYY') : null, 'year');
        },
        [onFilterChange]
    );

    const handleRangeChange = useCallback(
        (dates: [Moment, Moment] | null, dateStrings: [string, string]) => {
            setSelectedRange(dates);
            console.log(`Selected range: ${dates ? `${dates[0].format('YYYY-MM-DD')} to ${dates[1].format('YYYY-MM-DD')}` : 'null'}`);
            if (dates) {
                const rangeValue = `${dates[0].format('YYYY-MM-DD')},${dates[1].format('YYYY-MM-DD')}`;
                params.set("periodValue", rangeValue);
            } else {
                params.delete("periodValue");
            }
            replace(`${pathname}?${params.toString()}`);
            onFilterChange(
                dates
                    ? { from: dates[0].format('YYYY-MM-DD'), to: dates[1].format('YYYY-MM-DD') }
                    : null,
                'range'
            );
        },
        [onFilterChange]
    );

    console.log(filterType);
    console.log(selectedDate);
    

    return (
        <>
            <div className='flex space-x-5 items-center'>
                <Radio.Group onChange={handleFilterTypeChange} value={filterType}>
                    <Radio value="day">Ngày</Radio>
                    <Radio value="month">Tháng</Radio>
                    <Radio value="year">Năm</Radio>
                    <Radio value="range">Khoảng thời gian</Radio>
                </Radio.Group>

                {filterType === 'day' && (
                    <DatePicker  onChange={handleDateChange} value={selectedDate} placeholder="Chọn ngày" />
                )}

                {filterType === 'month' && (
                    <DatePicker
                        picker="year"
                        onChange={handleMonthChange}
                        value={selectedDate}
                        placeholder="Chọn năm"
                    />
                )}

                {filterType === 'year' && (
                    <DatePicker
                        picker="year"
                        onChange={handleYearChange}
                        value={selectedDate}
                        placeholder="Chọn năm"
                    />
                )}

                {filterType === 'range' && (
                    <RangePicker
                        onChange={handleRangeChange}
                        value={selectedRange}
                        locale={locale}
                    />
                )}
            </div>
        </>
    );
};

export default StatisticalDateFilter;
