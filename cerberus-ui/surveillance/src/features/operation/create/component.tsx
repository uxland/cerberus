import React, { useState } from 'react';
import { SurveillanceOperationForm } from './ui/component';

export const SurveillanceOperationEditor = () => {

    return (
        <div className="space-y-6">
            <SurveillanceOperationForm initialModel={{ name: "", questions: [] }} />
        </div>
    );
}