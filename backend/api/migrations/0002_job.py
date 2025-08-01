# Generated by Django 5.1.2 on 2025-07-04 12:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('requirements', models.JSONField(blank=True, default=list, null=True)),
                ('location', models.CharField(max_length=255)),
                ('posted_at', models.DateTimeField(auto_now_add=True)),
                ('salary_min', models.IntegerField(blank=True, null=True)),
                ('salary_max', models.IntegerField(blank=True, null=True)),
                ('salary_type', models.CharField(choices=[('Range', 'Range'), ('Fixed', 'Fixed'), ('Negotiable', 'Negotiable')], default='Negotiable', max_length=20)),
                ('employment_type', models.CharField(choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract'), ('Internship', 'Internship'), ('Temporary', 'Temporary'), ('Other', 'Other')], default='Full-time', max_length=20)),
                ('experience_level', models.CharField(choices=[('Entry', 'Entry'), ('Mid', 'Mid'), ('Senior', 'Senior'), ('Director', 'Director'), ('Executive', 'Executive'), ('Other', 'Other')], default='Entry', max_length=20)),
                ('application_deadline', models.DateField(blank=True, null=True)),
                ('benefits', models.JSONField(blank=True, default=list, null=True)),
                ('is_remote', models.BooleanField(default=False)),
                ('company_snapshot', models.JSONField(blank=True, null=True)),
                ('other_details', models.TextField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jobs', to='api.companyprofile')),
            ],
        ),
    ]
